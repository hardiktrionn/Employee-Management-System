import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import React from 'react'
import NewPassword from './NewPassword';

export default async function newPasswordpage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (token) {
    redirect("/dashboard");
  }

  return <NewPassword />;
}
