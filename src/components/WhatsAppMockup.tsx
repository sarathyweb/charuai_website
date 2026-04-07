"use client";

import { motion } from "framer-motion";

const messages = [
  {
    from: "charu",
    text: "Hey! How are you feeling about today?",
    delay: 0.5,
  },
  {
    from: "user",
    text: "I have 20 things to do and can't start",
    delay: 1.2,
  },
  {
    from: "charu",
    text: "That happens. Let's pick one small thing. What feels most urgent?",
    delay: 2.0,
  },
];

export default function WhatsAppMockup() {
  return (
    <div className="bg-surface rounded-2xl shadow-card-hover max-w-sm mx-auto overflow-hidden border border-warm-gray/50">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-warm-gray bg-surface">
        <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white font-serif text-sm">
          C
        </div>
        <div>
          <p className="text-sm font-medium text-text">Charu</p>
          <p className="text-xs text-green-600 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
            online
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex flex-col gap-3 p-4 bg-accent-surface/40 min-h-[200px]">
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              duration: 0.4,
              delay: msg.delay,
              ease: [0.22, 1, 0.36, 1],
            }}
            className={
              msg.from === "charu"
                ? "self-start max-w-[80%]"
                : "self-end max-w-[80%]"
            }
          >
            <div
              className={
                msg.from === "charu"
                  ? "bg-surface rounded-2xl rounded-tl-sm px-3.5 py-2.5 shadow-sm"
                  : "bg-primary rounded-2xl rounded-tr-sm px-3.5 py-2.5 shadow-sm"
              }
            >
              <p
                className={`text-sm ${
                  msg.from === "charu" ? "text-text" : "text-white"
                }`}
              >
                {msg.from === "user" ? msg.text.replace("'", "\u2019") : msg.text}
              </p>
            </div>
          </motion.div>
        ))}

        {/* Typing indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.8 }}
          className="self-start"
        >
          <div className="bg-surface rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm inline-flex gap-1.5 items-center">
            <span className="typing-dot" />
            <span className="typing-dot" />
            <span className="typing-dot" />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
