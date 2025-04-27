export function Background() {
  return (
    <div className="absolute inset-0 -z-10 h-full w-full overflow-hidden">
      <div className="bg-secondary w-[50vw] h-[50vw] md:w-[40vw] md:h-[40vw] lg:w-[30vw] lg:h-[30vw] rounded-full blur-[20vw] md:blur-[15vw] lg:blur-[10vw] absolute top-[-10vw] left-[-10vw] opacity-80"></div>
      <div className="bg-tertiary w-[50vw] h-[50vw] md:w-[40vw] md:h-[40vw] lg:w-[30vw] lg:h-[30vw] rounded-full blur-[20vw] md:blur-[15vw] lg:blur-[10vw] absolute bottom-[-10vw] right-[-10vw] opacity-80"></div>
    </div>
  );
}
