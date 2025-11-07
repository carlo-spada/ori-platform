import { useState, FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { X, Plus, Check, Loader2 } from 'lucide-react';

export interface Milestone {
  id: string;
  label: string;
  completed: boolean;
}

export interface GoalsValue {
  longTermVision?: string;
  targetRoles: string[];
  milestones: Milestone[];
}

export interface GoalsSectionProps {
  value: GoalsValue;
  labels: {
    heading: string;
    longTermVisionLabel: string;
    longTermVisionPlaceholder: string;
    longTermVisionHelper: string;
    targetRolesLabel: string;
    targetRolesHelper: string;
    addTargetRolePlaceholder: string;
    addTargetRoleButton: string;
    removeTargetRoleLabel: string;
    milestonesLabel: string;
    milestonesHelper: string;
    addMilestonePlaceholder: string;
    addMilestoneButton: string;
    saveButton: string;
    emptyTargetRoles: string;
    emptyMilestones: string;
  };
  onChange?: (value: GoalsValue) => void;
  onSubmit?: () => void;
  isSubmitting?: boolean;
}

/**
 * Career goals section for defining vision, target roles, and milestones.
 */
export function GoalsSection({
  value,
  labels,
  onChange,
  onSubmit,
  isSubmitting = false,
}: GoalsSectionProps) {
  const [goalsData, setGoalsData] = useState<GoalsValue>(value);
  const [newRole, setNewRole] = useState('');
  const [newMilestone, setNewMilestone] = useState('');

  const updateGoals = (updates: Partial<GoalsValue>) => {
    const updated = { ...goalsData, ...updates };
    setGoalsData(updated);
    onChange?.(updated);
  };

  const handleAddRole = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = newRole.trim();
    if (trimmed) {
      updateGoals({ targetRoles: [...goalsData.targetRoles, trimmed] });
      setNewRole('');
    }
  };

  const handleRemoveRole = (index: number) => {
    updateGoals({
      targetRoles: goalsData.targetRoles.filter((_, i) => i !== index),
    });
  };

  const handleAddMilestone = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = newMilestone.trim();
    if (trimmed) {
      const milestone: Milestone = {
        id: Date.now().toString(),
        label: trimmed,
        completed: false,
      };
      updateGoals({ milestones: [...goalsData.milestones, milestone] });
      setNewMilestone('');
    }
  };

  const handleToggleMilestone = (id: string) => {
    updateGoals({
      milestones: goalsData.milestones.map((m) =>
        m.id === id ? { ...m, completed: !m.completed } : m
      ),
    });
  };

  const handleRemoveMilestone = (id: string) => {
    updateGoals({
      milestones: goalsData.milestones.filter((m) => m.id !== id),
    });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit?.();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Long-term Vision */}
      <section>
        <div className="mb-3">
          <label
            htmlFor="longTermVision"
            className="block text-lg font-semibold text-foreground"
          >
            {labels.longTermVisionLabel}
          </label>
          <p className="text-sm text-muted-foreground mt-1">
            {labels.longTermVisionHelper}
          </p>
        </div>
        <textarea
          id="longTermVision"
          value={goalsData.longTermVision || ''}
          onChange={(e) => updateGoals({ longTermVision: e.target.value })}
          placeholder={labels.longTermVisionPlaceholder}
          rows={4}
          className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent transition-all resize-none"
        />
      </section>

      {/* Target Roles */}
      <section>
        <div className="mb-3">
          <h3 className="text-lg font-semibold text-foreground">
            {labels.targetRolesLabel}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            {labels.targetRolesHelper}
          </p>
        </div>

        {goalsData.targetRoles.length > 0 ? (
          <div className="flex flex-wrap gap-2 mb-4">
            {goalsData.targetRoles.map((role, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 text-accent text-sm border border-accent/20"
              >
                {role}
                <button
                  type="button"
                  onClick={() => handleRemoveRole(index)}
                  aria-label={labels.removeTargetRoleLabel.replace('{role}', role)}
                  className="hover:opacity-70 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-full"
                >
                  <X className="h-3 w-3" aria-hidden="true" />
                </button>
              </span>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground mb-4">
            {labels.emptyTargetRoles}
          </p>
        )}

        <div className="flex gap-2">
          <input
            type="text"
            value={newRole}
            onChange={(e) => setNewRole(e.target.value)}
            placeholder={labels.addTargetRolePlaceholder}
            className="flex-1 px-4 py-2 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent transition-all"
          />
          <Button
            type="button"
            variant="outline"
            onClick={handleAddRole}
            disabled={!newRole.trim()}
          >
            <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
            {labels.addTargetRoleButton}
          </Button>
        </div>
      </section>

      {/* Key Milestones */}
      <section>
        <div className="mb-3">
          <h3 className="text-lg font-semibold text-foreground">
            {labels.milestonesLabel}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            {labels.milestonesHelper}
          </p>
        </div>

        {goalsData.milestones.length > 0 ? (
          <div className="space-y-2 mb-4">
            {goalsData.milestones.map((milestone) => (
              <div
                key={milestone.id}
                className="flex items-center gap-3 p-3 rounded-xl border border-border bg-card/30 hover:bg-card/50 transition-colors"
              >
                <button
                  type="button"
                  onClick={() => handleToggleMilestone(milestone.id)}
                  aria-label={`Mark "${milestone.label}" as ${
                    milestone.completed ? 'incomplete' : 'complete'
                  }`}
                  className="w-5 h-5 rounded border-2 border-accent flex items-center justify-center shrink-0 hover:bg-accent/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  {milestone.completed && (
                    <Check className="h-3 w-3 text-accent" aria-hidden="true" />
                  )}
                </button>
                <label
                  className="flex-1 text-sm text-foreground cursor-pointer"
                  onClick={() => handleToggleMilestone(milestone.id)}
                >
                  <span
                    className={
                      milestone.completed ? 'line-through opacity-60' : ''
                    }
                  >
                    {milestone.label}
                  </span>
                </label>
                <button
                  type="button"
                  onClick={() => handleRemoveMilestone(milestone.id)}
                  aria-label={`Remove milestone: ${milestone.label}`}
                  className="text-muted-foreground hover:text-destructive transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-full"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground mb-4">
            {labels.emptyMilestones}
          </p>
        )}

        <div className="flex gap-2">
          <input
            type="text"
            value={newMilestone}
            onChange={(e) => setNewMilestone(e.target.value)}
            placeholder={labels.addMilestonePlaceholder}
            className="flex-1 px-4 py-2 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent transition-all"
          />
          <Button
            type="button"
            variant="outline"
            onClick={handleAddMilestone}
            disabled={!newMilestone.trim()}
          >
            <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
            {labels.addMilestoneButton}
          </Button>
        </div>
      </section>

      {/* Submit Button */}
      <div className="flex justify-end pt-6 border-t border-border">
        <Button type="submit" disabled={isSubmitting} className="min-w-[140px]">
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
              Saving...
            </>
          ) : (
            labels.saveButton
          )}
        </Button>
      </div>
    </form>
  );
}
