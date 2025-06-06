import { useEffect, ReactNode, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../lib/store";
import { setUser } from "../redux/userSlice";

interface AuthGuardProps {
  children: ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter()
  const { user } = useSelector((state: RootState) => state.user);
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [checked, setChecked] = useState<boolean>(false)

  useEffect(() => {
    if (!user && !checked) {
      setChecked(true)
      verifyAuth();
    }
  }, []);

  const verifyAuth = async () => {
    setIsLoading(true)
    const res = await fetch("/api/check-auth", {
      method: "GET",
    });

    const data = await res.json();
    setIsLoading(false)
    if (data.success) {
      if (data.user.role == "admin") {
        dispatch(setUser(data.user))
      } else {
        router.push("/unathorized")
      }
    } else {
      router.push("/admin/login")
    }
  };


  return <>{children}</>;
};

export default AuthGuard;
