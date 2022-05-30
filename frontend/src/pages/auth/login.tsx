import { NextPage } from "next";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import doacaoApi, { Login } from "../../api";
import Field from "../../components/Field";
import Form from "../../components/Form";
import Notification, {
  NotificationProps,
  NotificationRef,
} from "../../components/Notification";

const LoginPage: NextPage = () => {
  const notificationRef = useRef<NotificationRef>(null);
  const [notificationContent, setNotificationContent] =
    useState<NotificationProps>({
      children: "",
      color: "danger",
    });
  const form = useForm<Login>();

  function handleSubmit(data: Login) {
    doacaoApi
      .login(data)
      .catch((err) => {
        setNotificationContent({
          children: err.message,
          color: "danger",
        });
        notificationRef.current?.show();
      })
      .then((data) => {
        console.log(data);
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
