import { css } from "@emotion/react";
import { GetServerSideProps, NextPage } from "next";
import doacaoApi, { ItemResponse } from "../api";
import ItemCard from "../components/ItemCard";

interface Props {
  items: ItemResponse[];
}

const listCss = css({
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, clamp(300px, 40%, 500px))",
  justifyContent: "center",
  gap: "1rem",
});

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const requests = Array(3)
    .fill(0)
    .map((_, index) => doacaoApi.getItems(index));

  const items = await Promise.all(requests);

  return {
    props: {
      items: items.flat(),
    },
  };
};

const IndexPage: NextPage<Props> = (props) => {
  return (
    <div css={listCss}>
      {props.items.map((item) => (
        <ItemCard key={item.id} item={item} />
      ))}
    </div>
  );
};

export default IndexPage;
