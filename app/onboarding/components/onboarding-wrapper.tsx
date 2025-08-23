'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// import { StepOne } from '@/app/onboarding/components/step-one';
// import { StepTwo } from '@/app/onboarding/components/step-two';
// import { StepThree } from '@/app/onboarding/components/step-three';

export default function OnboardingFormWrapper(props: any) {
  const [step, setStep] = useState(1);

  return (
    <div className="bg-card w-full rounded-lg border p-6 shadow-lg sm:p-8">
      {/* Progress bar */}
      <div className="bg-muted mb-6 h-2 w-full rounded">
        <div
          className="bg-primary h-2 rounded transition-all duration-300"
          style={{ width: `${(step / 3) * 100}%` }}
        />
      </div>

      {/* Step content with animation */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          {/* {step === 1 && <StepOne {...props} />}
          {step === 2 && <StepTwo {...props} />}
          {step === 3 && <StepThree {...props} />} */}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="mt-6 flex justify-between">
        {step > 1 && (
          <button
            onClick={() => setStep(step - 1)}
            className="bg-muted hover:bg-muted/80 rounded px-4 py-2"
          >
            Back
          </button>
        )}
        {step < 3 ? (
          <button
            onClick={() => setStep(step + 1)}
            className="bg-primary hover:bg-primary/90 ml-auto rounded px-4 py-2 text-white"
          >
            Next
          </button>
        ) : (
          <button
            type="submit"
            className="ml-auto rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
          >
            Complete Profile
          </button>
        )}
      </div>
    </div>
  );
}
