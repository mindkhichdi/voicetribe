
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

interface PricingDialogProps {
  open: boolean;
  onClose: () => void;
}

export const PricingDialog = ({ open, onClose }: PricingDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Upgrade Your Plan</DialogTitle>
          <DialogDescription>
            Choose the plan that best fits your needs
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="border rounded-lg p-4 space-y-4">
            <h3 className="font-bold text-lg">Free</h3>
            <p className="text-2xl font-bold">$0</p>
            <ul className="space-y-2">
              <li className="flex items-center">
                <Check className="h-4 w-4 mr-2 text-green-500" />
                Unlimited voice recordings
              </li>
              <li className="flex items-center">
                <Check className="h-4 w-4 mr-2 text-green-500" />
                1 text-to-speech/month
              </li>
            </ul>
            <Button className="w-full" variant="outline" disabled>
              Current Plan
            </Button>
          </div>
          <div className="border rounded-lg p-4 space-y-4 bg-purple/5">
            <h3 className="font-bold text-lg">Pro</h3>
            <p className="text-2xl font-bold">$10/mo</p>
            <ul className="space-y-2">
              <li className="flex items-center">
                <Check className="h-4 w-4 mr-2 text-green-500" />
                Unlimited voice recordings
              </li>
              <li className="flex items-center">
                <Check className="h-4 w-4 mr-2 text-green-500" />
                10 text-to-speech/month
              </li>
            </ul>
            <Button className="w-full">Upgrade to Pro</Button>
          </div>
          <div className="border rounded-lg p-4 space-y-4">
            <h3 className="font-bold text-lg">Team</h3>
            <p className="text-2xl font-bold">$29/mo</p>
            <ul className="space-y-2">
              <li className="flex items-center">
                <Check className="h-4 w-4 mr-2 text-green-500" />
                Unlimited voice recordings
              </li>
              <li className="flex items-center">
                <Check className="h-4 w-4 mr-2 text-green-500" />
                50 text-to-speech/month
              </li>
            </ul>
            <Button className="w-full">Upgrade to Team</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
