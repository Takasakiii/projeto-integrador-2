import { css } from "@emotion/react";
import { GetServerSideProps, NextPage } from "next";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import doacaoApi, { ItemWithUser, RestrictedApi } from "../../api";
import { Card } from "../../components/Cards";
import Carousel from "../../components/Carousel";
import { RootState } from "../../storage";

interface Props {
  data: ItemWithUser;
  images: string[];
}

export const getServerSideProps: GetServerSideProps<Props> = async (
  context
) => {
  const id = context.query.id as string;

  try {
    const item = await doacaoApi.getItem(id);
    const images = await doacaoApi.getItemImages(id);

    return {
      props: {
        data: item,
        images,
      },
    };
  } catch (err) {
    console.error(err);
    return {
      notFound: true,
    };
  }
};

function convertImages(itemId: string, images: string[]): string[] {
  return images.map((image) => doacaoApi.getImageUrl(image, itemId));
}

function getWppLink(phone: string): string {
  return `https://wa.me/55${phone}`;
}

function getEmailLink(email: string): string {
  return `mailto:${email}`;
}

const centerButton = css`
  margin: 0 auto;
  display: block;
  width: fit-content;
`;

const ItemPage: NextPage<Props> = (props) => {
  const [contact, setContact] = useState<string | null>(null);

  const { item, user } = props.data;

  const images = convertImages(item.id, props.images);
  const authSlice = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!authSlice.restrictedApi) return;
    const restrictedApi = new RestrictedApi(authSlice.restrictedApi);
    restrictedApi.getRestrictedUser(user.id).then((userData) => {
      if (userData.phone) {
        return setContact(getWppLink(userData.phone));
      }

      setContact(getEmailLink(userData.email));
    });
  }, [authSlice.restrictedApi, user.id]);

  return (
    <Card>
      <h1 className="title">{item.name}</h1>
      <Carousel images={images} />
      <strong>{`${user.name} ${user.surname}`}</strong>
      <p>{item.description}</p>

      {contact && (
        <a
          href={contact}
          className="button is-link mt-4"
          target="_blank"
          rel="noreferrer"
          css={centerButton}
        >
          Contatar {user.name}
        </a>
      )}
    </Card>
  );
};

export default ItemPage;
