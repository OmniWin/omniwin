"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { useToast } from "@/components/ui/use-toast";
// import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {validateReferralCode} from "@/app/services/authService";

import { useSelector, useDispatch, userSettingsSlice } from "@/lib/redux";
import { selectUserSettingsState } from "@/lib/redux/slices/userSettingsSlice/selectors";
import { useState, useEffect } from "react";

const formSchema = z.object({
    referralCode: z.string().min(1, { message: "Referral code is required" }),
});

type FormData = z.infer<typeof formSchema>;

const AccessFormByInvitation: React.FC = () => {
    // Rudex usedReferralCode state
    const dispatch = useDispatch();
    // const userSettingsState = useSelector(selectUserSettingsState);

    const [isReferralCodeValid, setIsReferralCodeValid] = useState<boolean>(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(formSchema),
    });
    const { toast } = useToast();

    const onSubmit = async (data: FormData) => {
        const isValid = await validateReferralCode(data.referralCode);

        setIsReferralCodeValid(isValid);

        if (isValid) {
            dispatch(userSettingsSlice.actions.setUsedReferralCode(data.referralCode));

            toast({
                title: "Success",
                description: "Referral code accepted. You can now proceed with the registration.",
                duration: 3000,
                variant: 'success',
            });
        } else {
            toast({
                title: "Error",
                description: "Invalid referral code. Please try again.",
                variant: 'error',
                duration: 3000,
            });
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
            <p className="text-zinc-400 text-sm">Now undergoing closed testing, it is available to users on the waiting list or by invitation codes.</p>
            <Input variant="insetLabel" size="lg" label="Referral Code" id="referralCode" type="text" {...register("referralCode")} autoComplete="off" />
            {errors.referralCode && <p className="mt-2 text-sm text-red-600">{errors.referralCode.message}</p>}
            <Button type="submit" variant="primary">
                Submit
            </Button>
        </form>
    );
};

export default AccessFormByInvitation;
