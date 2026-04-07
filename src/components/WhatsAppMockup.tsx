export default function WhatsAppMockup() {
  return (
    <div className="bg-surface rounded-md shadow-card max-w-sm mx-auto overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-warm-gray">
        <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white font-serif text-sm">
          C
        </div>
        <div>
          <p className="text-sm font-medium text-text">Charu</p>
          <p className="text-xs text-muted">online</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex flex-col gap-3 p-4 bg-accent-surface/40">
        {/* Charu message */}
        <div className="self-start max-w-[80%] bg-accent-surface rounded-lg rounded-tl-none px-3 py-2">
          <p className="text-sm text-text">
            Hey! How are you feeling about today?
          </p>
        </div>

        {/* User message */}
        <div className="self-end max-w-[80%] bg-primary rounded-lg rounded-tr-none px-3 py-2">
          <p className="text-sm text-white">
            I have 20 things to do and can&apos;t start
          </p>
        </div>

        {/* Charu message */}
        <div className="self-start max-w-[80%] bg-accent-surface rounded-lg rounded-tl-none px-3 py-2">
          <p className="text-sm text-text">
            That happens. Let&apos;s pick one small thing. What feels most
            urgent?
          </p>
        </div>
      </div>
    </div>
  );
}
