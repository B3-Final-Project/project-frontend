'use client';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useProfileCreation } from "@/hooks/useProfileCreation";
import { PROFILE_STEPS } from "./StepComponent";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { useParams } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function LifestyleComponent() {
  const { lifestyle, setLifestyle, goToNextStep, goToPreviousStep } = useProfileCreation();
  const { step } = useParams<{ step: string }>();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: string) => {
    setLifestyle({...lifestyle, [field]: value });
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!lifestyle.smoking) {
      newErrors.smoking = 'Please select an option';
    }

    if (!lifestyle.drinking) {
      newErrors.drinking = 'Please select an option';
    }

    // Religion, politics, and zodiac are optional

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      goToNextStep(step as string, PROFILE_STEPS);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card className="p-4">
        <h3 className="text-lg font-medium mb-4">Lifestyle & Values</h3>

        <div className="grid grid-cols-1 gap-6">
          <div className="space-y-2">
            <Label htmlFor="smoking">Smoking</Label>
            <Select
              value={lifestyle.smoking || ''}
              onValueChange={(value) => handleChange('smoking', value)}
            >
              <SelectTrigger id="smoking" className={errors.smoking ? 'border-red-500' : ''}>
                <SelectValue placeholder="Do you smoke?" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="never">Never</SelectItem>
                <SelectItem value="occasionally">Occasionally</SelectItem>
                <SelectItem value="regularly">Regularly</SelectItem>
                <SelectItem value="trying-to-quit">Trying to quit</SelectItem>
              </SelectContent>
            </Select>
            {errors.smoking && <p className="text-sm text-red-500">{errors.smoking}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="drinking">Drinking</Label>
            <Select
              value={lifestyle.drinking || ''}
              onValueChange={(value) => handleChange('drinking', value)}
            >
              <SelectTrigger id="drinking" className={errors.drinking ? 'border-red-500' : ''}>
                <SelectValue placeholder="Do you drink alcohol?" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="never">Never</SelectItem>
                <SelectItem value="socially">Socially</SelectItem>
                <SelectItem value="regularly">Regularly</SelectItem>
              </SelectContent>
            </Select>
            {errors.drinking && <p className="text-sm text-red-500">{errors.drinking}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="religion">Religion</Label>
            <Select
              value={lifestyle.religion || ''}
              onValueChange={(value) => handleChange('religion', value)}
            >
              <SelectTrigger id="religion">
                <SelectValue placeholder="Religious beliefs (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="atheist">Atheist</SelectItem>
                <SelectItem value="agnostic">Agnostic</SelectItem>
                <SelectItem value="buddhist">Buddhist</SelectItem>
                <SelectItem value="christian">Christian</SelectItem>
                <SelectItem value="hindu">Hindu</SelectItem>
                <SelectItem value="jewish">Jewish</SelectItem>
                <SelectItem value="muslim">Muslim</SelectItem>
                <SelectItem value="spiritual">Spiritual but not religious</SelectItem>
                <SelectItem value="other">Other</SelectItem>
                <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="politics">Political Views</Label>
            <Select
              value={lifestyle.politics || ''}
              onValueChange={(value) => handleChange('politics', value)}
            >
              <SelectTrigger id="politics">
                <SelectValue placeholder="Political views (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="liberal">Liberal</SelectItem>
                <SelectItem value="moderate">Moderate</SelectItem>
                <SelectItem value="conservative">Conservative</SelectItem>
                <SelectItem value="not-political">Not political</SelectItem>
                <SelectItem value="other">Other</SelectItem>
                <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="zodiac">Zodiac Sign</Label>
            <Select
              value={lifestyle.zodiac || ''}
              onValueChange={(value) => handleChange('zodiac', value)}
            >
              <SelectTrigger id="zodiac">
                <SelectValue placeholder="Zodiac sign (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="aries">Aries</SelectItem>
                <SelectItem value="taurus">Taurus</SelectItem>
                <SelectItem value="gemini">Gemini</SelectItem>
                <SelectItem value="cancer">Cancer</SelectItem>
                <SelectItem value="leo">Leo</SelectItem>
                <SelectItem value="virgo">Virgo</SelectItem>
                <SelectItem value="libra">Libra</SelectItem>
                <SelectItem value="scorpio">Scorpio</SelectItem>
                <SelectItem value="sagittarius">Sagittarius</SelectItem>
                <SelectItem value="capricorn">Capricorn</SelectItem>
                <SelectItem value="aquarius">Aquarius</SelectItem>
                <SelectItem value="pisces">Pisces</SelectItem>
                <SelectItem value="dont-believe">Don&#39;t believe in zodiac</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      <div className="flex justify-between pt-6">
        <Button
          type="button"
          variant="outline"
          onClick={() => goToPreviousStep(step as string, PROFILE_STEPS)}
        >
          Back
        </Button>
        <Button type="submit">
          Next
        </Button>
      </div>
    </form>
  );
}
