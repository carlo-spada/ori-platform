import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import type { OnboardingData } from "@/lib/types";

interface GoalsStepProps {
  value: OnboardingData['goals'];
  copy: {
    headline: string;
    description: string;
    longTermVisionLabel: string;
    longTermVisionPlaceholder: string;
    targetRolesLabel: string;
    targetRolesPlaceholder: string;
    helper: string;
  };
  onChange: (value: OnboardingData['goals']) => void;
}

export function GoalsStep({ value, copy, onChange }: GoalsStepProps) {
  const [roleInput, setRoleInput] = useState("");

  const handleAddRole = () => {
    const trimmed = roleInput.trim();
    if (trimmed && !value.targetRoles.includes(trimmed)) {
      onChange({
        ...value,
        targetRoles: [...value.targetRoles, trimmed]
      });
      setRoleInput("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddRole();
    }
  };

  const handleRemoveRole = (role: string) => {
    onChange({
      ...value,
      targetRoles: value.targetRoles.filter(r => r !== role)
    });
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

      <div className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="vision">{copy.longTermVisionLabel}</Label>
          <Textarea
            id="vision"
            placeholder={copy.longTermVisionPlaceholder}
            value={value.longTermVision}
            onChange={(e) => onChange({ ...value, longTermVision: e.target.value })}
            rows={4}
            autoFocus
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="targetRoles">{copy.targetRolesLabel}</Label>
          <div className="flex gap-2">
            <Input
              id="targetRoles"
              type="text"
              placeholder={copy.targetRolesPlaceholder}
              value={roleInput}
              onChange={(e) => setRoleInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <Button onClick={handleAddRole} type="button">
              Add
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            {copy.helper}
          </p>

          {value.targetRoles.length > 0 && (
            <div className="flex flex-wrap gap-2 p-3 rounded-lg border border-white/10 bg-white/[0.02] min-h-[60px]">
              {value.targetRoles.map((role) => (
                <Badge
                  key={role}
                  variant="secondary"
                  className="flex items-center gap-1.5 px-3 py-1.5"
                >
                  {role}
                  <button
                    type="button"
                    onClick={() => handleRemoveRole(role)}
                    className="hover:bg-white/10 rounded-full p-0.5 transition-colors"
                    aria-label={`Remove role ${role}`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
