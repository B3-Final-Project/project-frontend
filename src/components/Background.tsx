
export function Background() {
  return (
    <div className={'absolute -z-10 top-0 left-0 h-full w-screen'}>
      <div className="bg-secondary w-[300px] h-[300px] md:w-[600px] md:h-[600px] lg:w-[800px] lg:h-[800px] rounded-full blur-[100px] md:blur-[150px] lg:blur-[200px] absolute top-[-100px] md:top-[-200px] lg:top-[-300px] left-[-100px] md:left-[-200px] lg:left-[-300px] opacity-100 md:opacity-80 lg:opacity-60"></div>
      <div className="bg-tertiary w-[300px] h-[300px] md:w-[600px] md:h-[600px] lg:w-[800px] lg:h-[800px] rounded-full blur-[100px] md:blur-[150px] lg:blur-[200px] absolute top-[100px] md:top-[200px] lg:top-[300px] right-[-200px] md:right-[-300px] lg:right-[-400px] opacity-100 md:opacity-80 lg:opacity-60"></div>
    </div>
  );
}
