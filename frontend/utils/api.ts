import axios from "axios";
import {useState} from "react";

class Api {
    static useAxiosWithToken = async function (config) {
        const [data, setData] = useState(undefined);
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState(undefined);

        axios(config).then(res => {
            setData(res.data);
        }).catch(err => {
            setError(err);
        }).finally(() => setLoading(false));

        return [
            [data, loading, error],
        ]
    }
}

export default Api;
