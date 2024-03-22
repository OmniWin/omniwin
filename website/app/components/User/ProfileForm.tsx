"use client";

import React, { useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import CustomImageWithFallback from "@/app/components/CustomImageWithFallback";
import { useToast } from "@/components/ui/use-toast";

// Rudex ModalOpen state
import { useSelector, useDispatch, userSettingsSlice } from "@/lib/redux";
import { selectUserSettingsState } from "@/lib/redux/slices/userSettingsSlice/selectors";

// Adjust the schema to not require avatar as a string since it will be a File
const formSchema = z.object({
    // avatar is removed from the zod schema as its validation will be handled separately
    username: z.string().min(1, { message: "Username is required" }),
    publicDescription: z.string().min(1, { message: "Public description is required" }),
});

type FormData = z.infer<typeof formSchema> & {
    avatar?: FileList | null; // Add avatar as an optional FileList
};

const ProfileForm: React.FC = () => {
    const avatarInputRef = React.useRef<HTMLInputElement>(null);
    const userSettingsState = useSelector(selectUserSettingsState);
    const { toast } = useToast();
    const dispatch = useDispatch();
    const [isSaving, setIsSaving] = React.useState(false);
    const [isMounted, setIsMounted] = React.useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        setValue,
    } = useForm<FormData>({
        resolver: zodResolver(formSchema),
    });
    const avatar = watch("avatar");

    const onSubmit = async (data: FormData) => {
        // Create a FormData object to send the file along with other form data
        const formData = new FormData();
        setIsSaving(true);

        // Append file to formData if available
        if (avatar?.length) {
            formData.append("avatar", avatar[0]);
        }

        // Append other fields to formData
        formData.append("username", data.username);
        formData.append("description", data.publicDescription);

        // Submit formData to the backend
        const domain = process.env.NEXT_PUBLIC_API_URL;
        try {
            const response = await fetch(`${domain}/v1/user`, {
                method: "PUT",
                body: formData,
                credentials: "include",
            });

            if (!response.ok) {
                toast({
                    title: "Error",
                    description: "An error occurred while saving your settings. Please try again.",
                    variant: "error",
                    duration: 3000,
                });
                setIsSaving(false);
                return;
                // throw new Error('Network response was not ok');
            }

            const userData = await response.json();
            dispatch(userSettingsSlice.actions.setUser(userData));
            toast({
                title: "Success",
                description: "Your settings have been saved.",
                variant: "success",
                duration: 3000,
            });
            setIsSaving(false);
        } catch (error) {
            console.error("Error validating message:", error);
            setIsSaving(false);
            toast({
                title: "Error",
                description: "An error occurred while saving your settings. Please try again.",
                variant: "error",
                duration: 3000,
            });
            // throw error; // Rethrow the error if you want to handle it outside
        }
    };

    useEffect(() => {
        // Prefill the form with the user's data
        if (userSettingsState.user) {
            const { username, description, avatar } = userSettingsState.user;
            // Set the form values
            setValue("username", username);
            setValue("publicDescription", description);
            // setValue("avatar", avatar);
        }
    }, [userSettingsState.data, register]);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" encType="multipart/form-data">
            <div className="flex items-center gap-x-8">
                {isMounted && avatar?.length && <CustomImageWithFallback
                    key={avatar?.length}
                    src={avatar?.length ? URL.createObjectURL(avatar[0]) : ""}
                    alt=""
                    className="rounded-xl ring-4 ring-zinc-800 object-cover w-24 h-24 max-w-24 max-h-24"
                    containerClass="!w-auto"
                    width={96}
                    height={96}
                    sizes="100%"
                    style={{
                        objectFit: "cover",
                        width: "100%",
                    }}
                />}
                {isMounted && !avatar?.length && <CustomImageWithFallback
                    key={userSettingsState.user.avatar}
                    src={`/images/uploads/avatars/${userSettingsState.user.avatar}`}
                    alt=""
                    className="rounded-xl ring-4 ring-zinc-800 object-cover w-24 h-24 max-w-24 max-h-24"
                    containerClass="!w-auto"
                    width={96}
                    height={96}
                    sizes="100%"
                    style={{
                        objectFit: "cover",
                        width: "100%",
                    }}
                />}
                <div>
                    {/* <button type="button" className="rounded-md bg-white/10 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-white/20">Change avatar</button> */}
                    <Button type="button" variant="secondary" size="sm" onClick={() => avatarInputRef.current?.click()}>
                        Change avatar
                    </Button>
                    <input type="file" id="avatar" {...register("avatar")} className="hidden" ref={avatarInputRef} onChange={() => setValue("avatar", avatarInputRef.current?.files)} />
                    <p className="mt-2 text-xs leading-5 text-zinc-400">JPG, GIF or PNG. 1MB max.</p>
                    {errors.avatar && <p className="mt-2 text-sm text-red-600">{errors.avatar.message}</p>}
                </div>
            </div>
            <div>
                <Input variant="insetLabel" size="lg" label="Username" id="username" type="text" {...register("username")} autoComplete="off" />
                {errors.username && <p className="mt-2 text-sm text-red-600">{errors.username.message}</p>}
            </div>
            <div>
                <Textarea variant="insetLabel" size="lg" label="Public Description" id="publicDescription" {...register("publicDescription")}></Textarea>
                {errors.publicDescription && <p className="mt-2 text-sm text-red-600">{errors.publicDescription.message}</p>}
            </div>
            <Button type="submit" variant="primary" disabled={isSaving}>
                Save Changes
            </Button>
        </form>
    );
};

export default ProfileForm;
