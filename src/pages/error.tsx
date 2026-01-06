export default function ErrorPage() {
    return (
        <main className="h-screen w-full flex items-center justify-center">
            <div className="card w-96 bg-base-100 card-md shadow-sm p-6 space-y-4">
                <h1 className="text-md font-bold underline">Ups! Seems to be an error.</h1>
                <p>
                    The page you are looking for does not exist or an unexpected error has occurred. Please check the URL or return to the <a href="/dashboard">dashboard home</a>.
                </p>
                <a href="/dashboard" className="btn">Go to Dashboard</a>
            </div>
        </main>
    )
}