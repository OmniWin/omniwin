"use client";

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { useState, useEffect } from 'react';

const formSchema = z.object({
  referralCode: z.string().min(1, { message: "Referral code is required" }),
});

type FormData = z.infer<typeof formSchema>;

interface AccessFormByInvitationDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const AccessFormByInvitationDialog: React.FC<AccessFormByInvitationDialogProps> = ({ isOpen, onClose }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });
  const { toast } = useToast();
  const [isClientOpen, setClientOpen] = useState(false);

  const onSubmit = (data: FormData) => {
    console.log('Referral Code:', data.referralCode);
    toast({
      title: "Success",
      description: "Referral code accepted. You can now proceed with the registration.",
    });
    onClose(); // Optionally close the dialog upon successful submission
  };

  useEffect(() => {
    // Now that we're on the client, set the dialog to match the intended open state
    setClientOpen(isOpen);
  }, [isOpen]);

  return (
    <Dialog open={isClientOpen}>
      <DialogContent className="sm:max-w-[425px] lg:max-w-2xl">
        <DialogHeader>
          <DialogTitle className='text-white'>Referral Code</DialogTitle>
          <DialogDescription>Enter your referral code to proceed with the registration.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <Input
            variant="insetLabel"
            size="lg"
            label="Referral Code"
            id="referralCode"
            type="text"
            {...register('referralCode')}
            autoComplete='off'
          />
          {errors.referralCode && <p className="mt-2 text-sm text-red-600">{errors.referralCode.message}</p>}
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" onClick={onClose} variant="secondary">
                Close
              </Button>
            </DialogClose>
            <Button type="submit" variant='primary'>
              Submit
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AccessFormByInvitationDialog;
