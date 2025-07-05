export function LoadingFallback() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background">
      <div className="flex flex-col items-center justify-center gap-8">
        <style jsx>{`
          @keyframes scale-pulse {
            0%, 100% { transform: scale(1); opacity: 0.3; }
            50% { transform: scale(1.5); opacity: 1; }
          }
          
          .scale-pulse {
            animation: scale-pulse 1.5s ease-in-out infinite;
          }
          
          .scale-pulse-delayed {
            animation: scale-pulse 1.5s ease-in-out 0.75s infinite;
          }
          
      
        `}</style>


        <div className="relative flex items-center justify-center">
          <div className="h-28 w-28 rounded-full bg-primary/20 scale-pulse" />
          <div className="absolute h-28 w-28 rounded-full bg-primary/30 scale-pulse-delayed" />
        </div>

        <h2 className="text-primary mt-4">Loading...</h2>

      </div>
    </div>
  );
}
