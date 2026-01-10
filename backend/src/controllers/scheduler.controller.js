import { openai } from "../config/openai.js";

export const generateSchedule = async (req, res) => {
  try {
    const { dailySchedule, taskList } = req.body;

    console.log("Received schedule request:", { dailySchedule, taskList });

    if (!dailySchedule || !taskList || !Array.isArray(taskList)) {
      return res.status(400).json({ 
        error: "Daily schedule and task list are required",
        details: "Expected dailySchedule (array) and taskList (array)" 
      });
    }

    if (taskList.length === 0) {
      return res.status(400).json({ 
        error: "No tasks to schedule",
        details: "Task list is empty" 
      });
    }

    if (!Array.isArray(dailySchedule) || dailySchedule.length === 0) {
      return res.status(400).json({ 
        error: "Daily schedule is required",
        details: "Please add at least one commitment to find free time slots" 
      });
    }

    // Build the AI prompt with enhanced format
    const prompt = `You are an intelligent scheduling assistant. Analyze the user's calendar and create an optimized daily schedule.

EXISTING CALENDAR COMMITMENTS:
${dailySchedule.length > 0 ? dailySchedule.map(item => `${item.time} - ${item.name} (${item.duration} minutes)`).join('\n') : 'No existing commitments'}

TASKS TO SCHEDULE (${taskList.length} tasks):
${taskList.map((task, idx) => `${idx + 1}. ${task.title}
   Duration: ${task.duration} minutes
   Priority: ${task.priority}
   Category: ${task.category || 'General'}
   Notes: ${task.description || task.timePreference || 'None'}`).join('\n\n')}

SCHEDULING RULES:
1. Parse calendar and identify ALL free time slots
2. High-priority tasks → 9 AM - 12 PM (peak productivity)
3. Medium-priority tasks → Mid-morning or mid-afternoon
4. Low-priority tasks → Flexible slots or end of day
5. Group similar category tasks together
6. Add 5-10 minute buffers between different task categories
7. Mandatory 15-minute break every 2 hours of continuous work
8. NEVER overlap with existing commitments
9. Use 12-hour AM/PM time format
10. If task doesn't fit, mark it as unscheduled

OUTPUT FORMAT (JSON only, no additional text):
{
  "scheduledTasks": [
    {
      "taskId": "task id or title",
      "title": "task name",
      "startTime": "9:00 AM",
      "endTime": "10:30 AM",
      "duration": 90,
      "priority": "high",
      "category": "Work",
      "reason": "Scheduled during peak productivity hours for high-priority work"
    }
  ],
  "breaks": [
    {
      "startTime": "10:30 AM",
      "endTime": "10:45 AM",
      "duration": 15,
      "reason": "Rest break after 1.5 hours of work"
    }
  ],
  "unscheduledTasks": [
    {
      "taskId": "task id",
      "title": "task name",
      "reason": "No available slot of 90 minutes found"
    }
  ],
  "summary": {
    "totalTasksScheduled": 5,
    "totalTasks": 6,
    "totalTaskTime": "4 hours 30 minutes",
    "freeTimeRemaining": "2 hours 15 minutes",
    "scheduleDensity": "Moderate"
  },
  "optimizationNotes": [
    "High-priority tasks placed in morning hours for better focus",
    "Similar tasks grouped to maintain workflow"
  ],
  "suggestions": [
    "Consider breaking down longer tasks for better time management",
    "Add buffer time for unexpected interruptions"
  ]
}`;

    console.log("Calling OpenRouter API for scheduling...");
    
    const response = await openai.post("/chat/completions", {
      model: "openai/gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are an expert scheduling assistant. Always respond with ONLY valid JSON, no markdown, no explanation text."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 3000,
    });

    const aiResponse = response.data.choices[0].message.content;
    console.log("OpenRouter response received:", aiResponse.substring(0, 200));

    // Parse the AI response to extract JSON
    let scheduleData;
    try {
      // Remove markdown code blocks if present
      let jsonText = aiResponse.trim();
      jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      
      // Try to extract JSON object
      const jsonMatch = jsonText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        scheduleData = JSON.parse(jsonMatch[0]);
      } else {
        scheduleData = JSON.parse(jsonText);
      }

      // Validate structure
      if (!scheduleData.scheduledTasks || !Array.isArray(scheduleData.scheduledTasks)) {
        throw new Error("Invalid schedule format - missing scheduledTasks array");
      }

      console.log(`Successfully parsed schedule with ${scheduleData.scheduledTasks.length} tasks`);
    } catch (parseError) {
      console.error("Error parsing AI response:", parseError);
      console.error("AI Response was:", aiResponse);
      return res.status(500).json({ 
        error: "Failed to parse AI scheduling response",
        details: "AI returned invalid format",
        raw: aiResponse.substring(0, 500)
      });
    }

    res.json({
      success: true,
      ...scheduleData,
      message: `Successfully scheduled ${scheduleData.scheduledTasks.length} out of ${taskList.length} tasks`
    });

  } catch (error) {
    console.error("AI Scheduling ERROR:", error.response?.data || error.message);
    console.error("Full error stack:", error.stack);
    
    // Provide more specific error messages
    let errorMessage = "AI scheduling failed";
    let errorDetails = error.message;
    
    if (error.response) {
      errorMessage = "OpenRouter API error";
      errorDetails = error.response.data?.error?.message || JSON.stringify(error.response.data);
    } else if (error.code === 'ECONNREFUSED') {
      errorMessage = "Cannot connect to OpenRouter API";
      errorDetails = "Network connection failed";
    }
    
    res.status(500).json({ 
      error: errorMessage, 
      details: errorDetails,
      type: error.name
    });
  }
};
