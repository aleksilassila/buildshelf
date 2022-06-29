import * as Form from "../../components/form/Form";
import theme from "../../constants/theme";
import Input from "../../components/ui/Input";

interface FormData {
  name: string;
  description: string;
  imageIds: string[];
}

const initialData: FormData = {
  name: "",
  description: "",
  imageIds: [],
};

const CreateCollection = () => {
  const [data, setData, changeField] = Form.useFormData<FormData>(
    initialData,
    "collectionFormData"
  );

  if (data === null) return <div />;

  return (
    <Form.Root>
      <Form.Section>
        <h2 className={theme.text.bold}>Upload Collection</h2>
      </Form.Section>
      <Form.Section>
        <Form.Label>
          <Form.LabelText>Name</Form.LabelText>
          <Input
            value={data.name}
            setValue={changeField("name")}
            placeholder="Name"
          />
        </Form.Label>
      </Form.Section>
    </Form.Root>
  );
};

export default CreateCollection;
