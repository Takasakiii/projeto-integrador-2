import { GetServerSideProps, NextPage } from "next";
import doacaoApi, { ItemResponse } from "../../api";
import Carousel from "../../components/Carousel";

interface Props {
  item: ItemResponse;
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
        item,
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

const ItemPage: NextPage<Props> = (props) => {
  return (
    <div>
      <Carousel images={props.images} itemId={props.item.id} />
    </div>
  );
};

export default ItemPage;
