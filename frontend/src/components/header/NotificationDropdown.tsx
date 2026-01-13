import { useNotifications } from "@/context/NotificationContext";

export default function NotificationDropdown() {
  const { notifications, removeNotification } = useNotifications();

  return (
    <div className="absolute right-0 mt-2 w-80 bg-white shadow-xl rounded-xl border z-50">
      <div className="p-3 font-semibold border-b">Notifications</div>

      {notifications.length === 0 ? (
        <div className="p-4 text-sm text-muted-foreground">
          No notifications
        </div>
      ) : (
        notifications.map(n => (
          <div
            key={n.id}
            onClick={() => removeNotification(n.id)}
            className="p-3 text-sm hover:bg-accent cursor-pointer border-b last:border-0"
          >
            <p className="font-medium">{n.title}</p>
            <p className="text-muted-foreground">{n.message}</p>
          </div>
        ))
      )}
    </div>
  );
}
