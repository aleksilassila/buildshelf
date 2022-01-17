import {useEffect, useState} from "react";
import axios from "axios";
import ModalContainer from "../../containers/ModalContainer";
import Status from "../statuses/Status";
import messages from "../../constants/messages";
import NetworkError from "../statuses/NetworkError";
import Table, {TableData} from "../common/Table";
import Button from "../common/Button";

const CategoryBrowser = ({show, setShow, setCategory}) => {
  const [data, setData] = useState<{ name: string }[]>(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(process.env.BACKEND_ENDPOINT + `/categories`)
      .then((res) => {
        setData(res.data || []);
      })
      .catch((err) => {
      });
  }, []);

  if (!show) return null;

  if (!data) {
    return (
      <ModalContainer close={() => setShow(false)} splash>
        <Status>
          <h2>{messages.loading}</h2>
        </Status>
      </ModalContainer>
    );
  }

  if (error) {
    return (
      <ModalContainer close={() => setShow(false)} splash>
        <NetworkError>
          <h2>{messages.errorTitle}</h2>
          <p>Could not fetch categories.</p>
        </NetworkError>
      </ModalContainer>
    );
  }

  const categoriesTableData: TableData = {
    rows: data.map((category, index) => [
      {
        content: <Button onClick={(e) => {
          setCategory(category.name)
          setShow(false);
        }}>Select</Button>
      },
      {
        content: <span>{category.name}</span>
      }
    ])
  }

  return <ModalContainer close={() => setShow(false)}>
    <h2>Browse categories</h2>
    <Table data={categoriesTableData}  />
  </ModalContainer>
};

export default CategoryBrowser;