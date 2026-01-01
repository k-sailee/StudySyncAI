import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  HelpCircle, Send, Sparkles, BookOpen, Clock, 
  ThumbsUp, ThumbsDown, Copy, RefreshCw, Lightbulb
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface Message {
  id: number;
  type: "user" | "ai";
  content: string;
  timestamp: Date;
}

const suggestedQuestions = [
  "What is the derivative of sin(x)?",
  "Explain Newton's third law",
  "How do I solve quadratic equations?",
  "What are the causes of World War I?",
];

export function DoubtSolverPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: "ai",
      content: "Hi! I'm your AI Study Assistant. I can help you understand concepts, solve problems, and answer your academic questions. What would you like to learn today?",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      type: "user",
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: messages.length + 2,
        type: "ai",
        content: getAIResponse(inputValue),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const getAIResponse = (question: string): string => {
    // Simulated AI responses
    if (question.toLowerCase().includes("derivative") || question.toLowerCase().includes("sin")) {
      return `Great question! The derivative of sin(x) is cos(x). 

Here's the step-by-step explanation:
1. **Definition**: The derivative measures the rate of change of a function
2. **For sin(x)**: Using the limit definition, we get d/dx[sin(x)] = cos(x)
3. **Remember**: This is one of the fundamental derivatives you should memorize

**Key tip**: The derivative of cos(x) is -sin(x), so they form a cycle!

Would you like me to explain how to derive this from first principles?`;
    }
    
    if (question.toLowerCase().includes("newton") || question.toLowerCase().includes("law")) {
      return `Newton's Third Law states: **"For every action, there is an equal and opposite reaction."**

This means:
- When object A exerts a force on object B, object B simultaneously exerts an equal and opposite force on object A
- These forces always come in pairs
- The forces act on different objects

**Real-world examples**:
1. 🚀 Rocket propulsion - gases push down, rocket goes up
2. 🏊 Swimming - you push water backward, it pushes you forward
3. 🚶 Walking - you push the ground backward, it pushes you forward

Would you like me to solve a problem using this law?`;
    }

    return `That's an interesting question! Let me help you understand this concept.

Based on your question about "${question}", here are some key points to consider:

1. **Understanding the basics**: Start by reviewing the fundamental concepts related to this topic
2. **Practice problems**: Working through examples will help reinforce your understanding
3. **Connect to real-world applications**: Try to relate this to everyday situations

Would you like me to:
- Explain this concept in more detail?
- Provide practice problems?
- Share related topics to explore?

Feel free to ask follow-up questions!`;
  };

  const handleSuggestedQuestion = (question: string) => {
    setInputValue(question);
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      <div className="mb-4">
        <h1 className="font-heading text-2xl lg:text-3xl font-bold flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-primary-foreground" />
          </div>
          AI Doubt Solver
        </h1>
        <p className="text-muted-foreground mt-1">Get instant help with your academic questions</p>
      </div>

      {/* Chat Container */}
      <div className="flex-1 bg-card rounded-2xl border border-border shadow-card overflow-hidden flex flex-col">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={cn(
                  "flex gap-3",
                  message.type === "user" && "flex-row-reverse"
                )}
              >
                <Avatar className={cn(
                  "w-8 h-8 shrink-0",
                  message.type === "ai" ? "bg-primary" : "bg-secondary"
                )}>
                  <AvatarFallback className={cn(
                    message.type === "ai" 
                      ? "gradient-bg text-primary-foreground" 
                      : "bg-secondary text-secondary-foreground"
                  )}>
                    {message.type === "ai" ? <Sparkles className="w-4 h-4" /> : "JD"}
                  </AvatarFallback>
                </Avatar>

                <div className={cn(
                  "max-w-[80%] rounded-2xl p-4",
                  message.type === "ai" 
                    ? "bg-accent/50 rounded-tl-sm" 
                    : "bg-primary text-primary-foreground rounded-tr-sm"
                )}>
                  <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                  
                  {message.type === "ai" && (
                    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border/50">
                      <Button variant="ghost" size="sm" className="h-7 text-xs">
                        <ThumbsUp className="w-3 h-3 mr-1" />
                        Helpful
                      </Button>
                      <Button variant="ghost" size="sm" className="h-7 text-xs">
                        <ThumbsDown className="w-3 h-3 mr-1" />
                        Not helpful
                      </Button>
                      <Button variant="ghost" size="sm" className="h-7 text-xs ml-auto">
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-3"
            >
              <Avatar className="w-8 h-8 gradient-bg">
                <AvatarFallback className="gradient-bg text-primary-foreground">
                  <Sparkles className="w-4 h-4" />
                </AvatarFallback>
              </Avatar>
              <div className="bg-accent/50 rounded-2xl rounded-tl-sm p-4">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Questions */}
        {messages.length <= 1 && (
          <div className="px-4 pb-4">
            <p className="text-sm text-muted-foreground mb-3 flex items-center gap-2">
              <Lightbulb className="w-4 h-4" />
              Try asking:
            </p>
            <div className="flex flex-wrap gap-2">
              {suggestedQuestions.map((question, index) => (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 * index }}
                  onClick={() => handleSuggestedQuestion(question)}
                  className="px-3 py-2 rounded-xl bg-accent/50 hover:bg-accent text-sm text-foreground transition-colors border border-border"
                >
                  {question}
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="p-4 border-t border-border bg-card">
          <div className="flex gap-2">
            <Input
              placeholder="Ask your doubt here..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              className="flex-1"
            />
            <Button 
              onClick={handleSend} 
              disabled={!inputValue.trim() || isTyping}
              className="gradient-bg shrink-0"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            AI responses are for educational purposes. Always verify with your textbooks and teachers.
          </p>
        </div>
      </div>
    </div>
  );
}
