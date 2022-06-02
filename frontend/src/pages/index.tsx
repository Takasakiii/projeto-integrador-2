import { css } from "@emotion/react";
import { GetServerSideProps, NextPage } from "next";
import { useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import doacaoApi, { IPagination, ItemWithUser } from "../api";
import ItemCard from "../components/ItemCard";

interface Props {
  paginationData: IPagination<ItemWithUser>;
}

const listCss = css({
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, clamp(300px, 40%, 500px))",
  justifyContent: "center",
  gap: "1rem",
  paddingTop: "1rem",
  marginBottom: "1rem",
});

const scrollMessages = css({
  textAlign: "center",
  color: "hsl(0, 0%, 71%)",
});

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const request = await doacaoApi.getItems(0);

  return {
    props: {
      paginationData: request,
    },
  };
};

const IndexPage: NextPage<Props> = (props) => {
  const [items, setItems] = useState(props.paginationData.data);
  const [currentPage, setCurrentPage] = useState(
    props.paginationData.currentPage
  );
  const [totalPages, setTotalPages] = useState(props.paginationData.totalPages);

  const hasMore = currentPage < totalPages;

  function loadMore() {
    doacaoApi.getItems(currentPage + 1).then((newItems) => {
      setItems((items) => [...items, ...newItems.data]);
      setCurrentPage(newItems.currentPage);
      setTotalPages(newItems.totalPages);
    });
  }

  return (
    <InfiniteScroll
      dataLength={items.length}
      next={loadMore}
      hasMore={hasMore}
      loader={<p css={scrollMessages}>Carregando...</p>}
      endMessage={
        <p css={scrollMessages}>
          Você chegou ao final, não tem mais itens para mostrar.
        </p>
      }
    >
      <div css={listCss}>
        {items.map((item) => (
          <ItemCard key={item.item.id} item={item} />
        ))}
      </div>
    </InfiniteScroll>
  );
};

export default IndexPage;
