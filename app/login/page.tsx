import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Silahkan Login
          </h1>
          <div className="w-16 h-0.5 bg-gray-800 mx-auto"></div>
        </div>

        <form className="space-y-6">
          <div>
            <Label
              htmlFor="username"
              className="text-sm font-medium text-gray-700"
            >
              Username
            </Label>
            <Input
              id="username"
              type="text"
              placeholder="Masukkan Username"
              className="mt-1"
            />
          </div>

          <div>
            <Label
              htmlFor="password"
              className="text-sm font-medium text-gray-700"
            >
              Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="Masukkan Password"
              className="mt-1"
            />
          </div>

          <Button className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3">
            Login
          </Button>
        </form>
      </div>
    </div>
  );
}
