import { HTMLProps, useState } from "react";
import doacaoApi, { ItemWithUser } from "../api";
import Image from "next/image";
import { css } from "@emotion/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBan } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

export interface ItemCardProps extends HTMLProps<HTMLAnchorElement> {
  item: ItemWithUser;
}

const cardLink = css({
  transitionDuration: "0.4s",
  transitionProperty: "transform",
  ":hover": {
    transform: "scale(1.05)",
    zIndex: 1,
  },
});

const noImage = css({
  backgroundColor: "#c6c6c6",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100%",
  width: "100%",
  position: "absolute",
  top: 0,
  left: 0,
  borderRadius: 4,
  flexDirection: "column",
  fontSize: "2rem",
});

const description = css({
  minHeight: "4rem",
  overflow: "auto",
});

const ItemCard: React.FC<ItemCardProps> = ({
  item: { item, user },
  ...props
}) => {
  const thumbnail = doacaoApi.getItemThumbnailUrl(item);

  return (
    <Link href={`/items/${item.id}`}>
      <a css={cardLink} {...props}>
        <div className="card">
          <div className="card-image">
            <figure className="image is-4by3">
              {thumbnail ? (
                <Image
                  src={thumbnail}
                  alt={`Imagem de ${item.name}`}
                  layout="fill"
                  objectFit="cover"
                />
              ) : (
                <div css={noImage}>
                  <FontAwesomeIcon icon={faBan} />
                  Sem Imagem
                </div>
              )}
            </figure>
          </div>
          <div className="card-content">
            <div className="media">
              <div className="media-content">
                <p className="title is-4">{item.name}</p>
                <p className="subtitle is-6">{`${user.name} ${user.surname}`}</p>
              </div>
            </div>

            <div className="content" css={description}>
              {item.description}
            </div>
          </div>
        </div>
      </a>
    </Link>
  );
};

export default ItemCard;
