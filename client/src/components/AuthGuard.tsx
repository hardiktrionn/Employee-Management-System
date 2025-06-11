import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../lib/store";
import { setLoading, setUser } from "../redux/userSlice";
import Loader from "./Loader";

// validate the user
const AuthGuard = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { user } = useSelector((state: RootState) => state.user);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [checked, setChecked] = useState<boolean>(false);

  // every page the to validate user are valid or not
  useEffect(() => {
    if (!user && !checked) {
      setChecked(true);
      const verifyAuth = async () => {
        dispatch(setLoading(true));
        setIsLoading(true);
        const res = await fetch("/api/check-auth", {
          method: "GET",
          credentials: "include",
        });

        const data = await res.json();
        setIsLoading(false);
        dispatch(setLoading(false));

        if (data.success) {
          dispatch(setUser(data.user));
        } else {
          router.push("/login");
        }
      };
      verifyAuth();
    }
  }, [user, checked, dispatch, router]);

  return <>{isLoading && !checked ? <Loader /> : children}</>;
};

export default AuthGuard;
