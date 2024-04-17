import ChatForm from "./components/ChatForm";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 lg:p-24">
      <div className="flex flex-col items-center justify-center w-full">
        <h1 className="text-xl lg:text-3xl font-semibold underline">
          User Chat Log Analysis
        </h1>
        <ChatForm />
      </div>
    </main>
  );
}
