import { NextPage } from "next";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import doacaoApi, { Login } from "../../api";
import Field from "../../components/Field";
import { Form } from "../../components/Cards";
import Notification, {
  NotificationProps,
  NotificationRef,
} from "../../components/Notification";
import { login } from "../../storage/Auth.slice";

const LoginPage: NextPage = () => {
  const notificationRef = useRef<NotificationRef>(null);
  const [notificationContent, setNotificationContent] =
    useState<NotificationProps>({
      children: "",
      color: "danger",
    });
  const form = useForm<Login>();
  const dispatch = useDispatch();
  const router = useRouter();

  function handleSubmit(data: Login) {
    doacaoApi
      .login(data)
      .then((data) => {
        dispatch(login(data));
        router.push("/");
      })
      .catch((err) => {
        setNotificationContent({
          children: err.message,
          color: "danger",
        });
        notificationRef.current?.show();
      });
  }

  return (
    <Form onSubmit={form.handleSubmit(handleSubmit)}>
      <Notification {...notificationContent} ref={notificationRef} />
      <h1 className="title">Entrar</h1>
      <Field label="Email" required {...form.register("email")} />
      <Field
        label="Password"
        type="password"
        required
        {...form.register("password")}
      />
      <button type="submit" className="button is-primary">
        Entrar
      </button>
    </Form>
  );
};

export default LoginPage;
