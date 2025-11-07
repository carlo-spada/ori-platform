import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface SkillsStepProps {
  skills: string[];
  copy: {
    headline: string;
    description: string;
    inputPlaceholder: string;
    helper: string;
    validationError: string;
  };
  onChange: (skills: string[]) => void;
}

export function SkillsStep({ skills, copy, onChange }: SkillsStepProps) {
  const [input, setInput] = useState("");

  const handleAdd = () => {
    const trimmed = input.trim();
    if (trimmed && !skills.includes(trimmed)) {
      onChange([...skills, trimmed]);
      setInput("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAdd();
    }
  };

  const handleRemove = (skill: string) => {
    onChange(skills.filter(s => s !== skill));
  };

  return (
    <div className="flex flex-col gap-6 py-4">
      <div className="space-y-2">
        <h2 className="text-xl sm:text-2xl font-semibold">
          {copy.headline}
        </h2>
        <p className="text-sm text-muted-foreground">
          {copy.description}
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder={copy.inputPlaceholder}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
          />
          <Button onClick={handleAdd} type="button">
            Add
          </Button>
        </div>

        <p className="text-xs text-muted-foreground">
          {copy.helper}
        </p>

        {skills.length > 0 && skills.length < 3 && (
          <p className="text-sm text-amber-600 dark:text-amber-400 font-medium">
            {copy.validationError}
          </p>
        )}

        {skills.length > 0 && (
          <div className="flex flex-wrap gap-2 p-3 rounded-lg border border-white/10 bg-white/[0.02] min-h-[60px]">
            {skills.map((skill) => (
              <Badge
                key={skill}
                variant="secondary"
                className="flex items-center gap-1.5 px-3 py-1.5"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => handleRemove(skill)}
                  className="hover:bg-white/10 rounded-full p-0.5 transition-colors"
                  aria-label={`Remove skill ${skill}`}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
