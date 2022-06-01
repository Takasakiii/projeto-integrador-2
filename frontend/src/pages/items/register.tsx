import { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { ItemRegister } from "../../api";
import Field from "../../components/Field";
import FilesList, { FileListRef } from "../../components/FilesList";
import Form from "../../components/Form";
import Notification, {
  NotificationProps,
  NotificationRef,
} from "../../components/Notification";
import { RootState } from "../../storage";

const ItemsRegisterPage: NextPage = () => {
  const form = useForm<ItemRegister>();
  const filesListRef = useRef<FileListRef>(null);
  const auth = useSelector((state: RootState) => state.auth);
  const router = useRouter();
  const [notificationData, setNotificationData] = useState<NotificationProps>({
    children: "",
    color: "danger",
  });

  const notificationRef = useRef<NotificationRef>(null);

  useEffect(() => {
    if (!auth.restrictedApi) {
      router.push("/auth/login");
    }
  });

  function handleSubmit(data: ItemRegister) {
    const api = auth.restrictedApi!;

    const images = filesListRef.current?.getFiles()!;

    api
      .addItem(data, images)
      .then((data) => {
        setNotificationData({
          children: (
            <>
              {data.item.name} foi adicionado com sucesso.{" "}
              <Link href={`/items/${data.item.id}`}>
                <a>Clique aqui para visualizar.</a>
              </Link>
            </>
          ),
          color: "success",
        });

        notificationRef.current?.show();
        form.reset();
      })
      .catch((err) => {
        setNotificationData({
          children: err.message,
          color: "danger",
        });

        notificationRef.current?.show();
      });
  }

  if (!auth.restrictedApi) return <></>;

  return (
    <Form onSubmit={form.handleSubmit(handleSubmit)}>
      <Notification {...notificationData} ref={notificationRef} />
      <h1 className="title">Adicione seu item para doação</h1>
      <Field label="Nome" required {...form.register("name")} />
      <Field label="Descrição" required {...form.register("description")} />
      <Field
        label="Quantidade"
        type="number"
        required
        min={1}
        {...form.register("amount")}
      />
      <FilesList ref={filesListRef} />
      <button className="button is-success">Adicionar</button>
    </Form>
  );
};

export default ItemsRegisterPage;
