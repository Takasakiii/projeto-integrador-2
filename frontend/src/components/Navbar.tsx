import { css } from "@emotion/react";
import Link from "next/link";
import { useState } from "react";
import classNames from "classnames";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../storage";
import { logout } from "../storage/Auth.slice";

const titleMarca = css({
  fontFamily: "var(--font-marca)",
  fontSize: "1.4rem",
});

const dropDownFixPosition = css({
  left: "-8rem",
});

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const auth = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  function handleToggle() {
    setIsOpen(!isOpen);
  }

  function handleLogout() {
    dispatch(logout());
  }

  return (
    <nav
      className="navbar is-fixed-top"
      role="navigation"
      aria-label="main navigation"
    >
      <div className="navbar-brand">
        <Link href="/">
          <a className="navbar-item">
            <h1 css={titleMarca}>Donations</h1>
          </a>
        </Link>

        <a
          role="button"
          className={classNames("navbar-burger", {
            "is-active": isOpen,
          })}
          onClick={handleToggle}
          aria-label="menu"
          aria-expanded="false"
          data-target="navbarBasicExample"
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>

      <div
        id="navbarBasicExample"
        className={classNames("navbar-menu", {
          "is-active": isOpen,
        })}
      >
        <div className="navbar-end">
          <div className="navbar-item">
            {auth.user ? (
              <div className="navbar-item has-dropdown is-hoverable">
                <a className="navbar-link is-arrowless">{auth.user.name}</a>
                <div className="navbar-dropdown" css={dropDownFixPosition}>
                  <Link href="/items/register">
                    <a className="navbar-item">Adicionar Item para Doação</a>
                  </Link>
                  <hr className="navbar-divider" />
                  <a className="navbar-item" onClick={handleLogout}>
                    Sair
                  </a>
                </div>
              </div>
            ) : (
              <div className="buttons">
                <Link href="/auth/singup">
                  <a className="button is-primary">
                    <strong>Cadastre-se</strong>
                  </a>
                </Link>
                <Link href="/auth/login">
                  <a className="button is-light">Logar-se</a>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
