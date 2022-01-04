import {useEffect, useState} from "react";
import axios from "axios";
import ModalContainer from "../../containers/ModalContainer";
import SplashText from "../statuses/SplashText";
import messages from "../../constants/messages";
import ErrorText from "../statuses/ErrorText";
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
        <SplashText>
          <h2>{messages.loading}</h2>
        </SplashText>
      </ModalContainer>
    );
  }

  if (error) {
    return (
      <ModalContainer close={() => setShow(false)} splash>
        <ErrorText>
          <h2>{messages.errorTitle}</h2>
          <p>Could not fetch categories.</p>
        </ErrorText>
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