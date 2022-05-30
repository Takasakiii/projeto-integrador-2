import { css } from "@emotion/react";
import { NextPage } from "next";
import Field from "../../components/Field";
import MaskedField from "../../components/MaskedField";
import { formatTellOrCell } from "../../formatters";
import { useForm, Controller } from "react-hook-form";
import { UserRegister } from "../../api";
import doacaoApi from "../../api";
import { useRef, useState } from "react";
import Notification, { NotificationRef } from "../../components/Notification";

const container = css({
  display: "flex",
  justifyContent: "center",
  paddingTop: "4rem",
});

const box = css({
  width: "clamp(300px, 30%, 600px)",
});

const SingUpPage: NextPage = () => {
  const form = useForm<UserRegister>();
  const notificationRef = useRef<NotificationRef>(null);
  const [notificationContent, setNotificationContent] = useState("");

  function handleSubmit(data: UserRegister) {
    doacaoApi.registerUser(data).catch((err) => {
      setNotificationContent(err.message);
      notificationRef.current?.show();
    });
  }

  return (
    <div css={container}>
      <form
        className="box"
        css={box}
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <Notification ref={notificationRef} color="danger">
          {notificationContent}
        </Notification>

        <h1 className="title">Registre-se</h1>
        <Field
          label="Nome"
          placeholder="João"
          required
          minLength={3}
          maxLength={255}
          {...form.register("name")}
        />
        <Field
          label="Sobrenome"
          placeholder="Silva Souza"
          required
          minLength={3}
          maxLength={255}
          {...form.register("surname")}
        />
        <Field
          label="Email"
          type="email"
          required
          placeholder="joaosilva@gmail.com"
          {...form.register("email")}
        />
        <Field
          label="Senha"
          type="password"
          required
          minLength={8}
          placeholder="●●●●●●●●"
          {...form.register("password")}
        />
        <Controller
          name="phone"
          control={form.control}
          render={({ field }) => (
            <MaskedField
              mask={formatTellOrCell}
              label="Telefone"
              placeholder="(00) 00000-0000"
              {...field}
            />
          )}
        />
        <button className="button is-primary">Registrar</button>
      </form>
    </div>
  );
};

export default SingUpPage;
