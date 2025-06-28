"use client"
import { authClient } from "@/lib/auth-client" // import the auth client
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Image from "next/image";


export default function User() {

    const {
        data: session,
        isPending, //loading state
        error, //error object
        refetch //refetch the session
    } = authClient.useSession();
    const router = useRouter();

    useEffect(() => {
        // If no session, redirect to sign-in page
        if (!session && !isPending) {
            router.push("/auth/sign-in");
        }
    }, [session, isPending, router]);
    
    
    console.log("Session Data:", session);
    return (
        <>
            <div className="flex flex-col items-center justify-center min-h-screen p-8">
                <div className="flex flex-col items-center justify-center gap-4">
                    {isPending && <p>Loading...</p>}
                    {error && <p>Error: {error.message}</p>}
                    {session &&
                        <div className="text-center display-flex flex-col items-center justify-center"> 
                            {session.user.image && (
                                <div className="mb-4">
                                    <Image
                                        src={session.user.image}
                                        alt="User Avatar"
                                        height={100}
                                        width={100}
                                        
                                        priority={true} // Load the image immediately
                                    />
                                </div>
                            )}
                            <p>Welcome back, {session.user.name}!</p>
                            <p>Email: {session.user.email}</p>
                        </div>
                    }
                </div>
                <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={() => {
                    refetch();

                }}>Refresh</button>
                <button
                    className="bg-red-500 text-white px-4 py-2 rounded"
                    onClick={async () => {
                        await authClient.signOut();
                        router.push("auth/sign-in"); // redirect to login page
                    }}
                >
                    Sign Out
                </button>
            </div>
        </>
    )
}