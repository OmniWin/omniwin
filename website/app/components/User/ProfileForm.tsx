import React from 'react';
import { z } from 'zod';
import { useForm } from "react-hook-form"
import { Input } from "@/components/ui/input";
import { Textarea } from '@/components/ui/textarea';
import { Button } from "@/components/ui/button";

const formSchema = z.object({
  nickname: z.string().min(1, { message: "Nickname is required" }),
  username: z.string().min(1, { message: "Username is required" }),
  publicDescription: z.string().min(1, { message: "Public description is required" }),
});

type FormData = z.infer<typeof formSchema>;

const ProfileForm: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

  const onSubmit = (data: FormData) => {
    console.log(data);
    // Here, submit your form data to the backend
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="nickname" className="block text-sm font-medium leading-6 text-zinc-100 mb-2">Nickname</label>
        <Input id="nickname" type="text" {...register('nickname')} className=""/>
        {errors.nickname && <p className="mt-2 text-sm text-red-600">{errors.nickname.message}</p>}
      </div>
      <div>
        <label htmlFor="username" className="block text-sm font-medium leading-6 text-zinc-100 mb-2">Username</label>
        <Input id="username" type="text" {...register('username')} className=""/>
        {errors.username && <p className="mt-2 text-sm text-red-600">{errors.username.message}</p>}
      </div>
      <div>
        <label htmlFor="publicDescription" className="block text-sm font-medium leading-6 text-zinc-100 mb-2">Public Description</label>
        <Textarea id="publicDescription" {...register('publicDescription')} className=""></Textarea>
        {errors.publicDescription && <p className="mt-2 text-sm text-red-600">{errors.publicDescription.message}</p>}
      </div>
      <Button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
        Submit
      </Button>
    </form>
  );
};

export default ProfileForm;
