import React, { useEffect } from "react";
import { getPlatoCountries } from "../store/countries/actions";
import { useDispatch, useSelector } from "react-redux";


/*const countries = [{
    country: "Brazilhhhhhh",
    locale: "pt_BR" 
}, {
    country: "Denmark",
    locale: "da_DK"
}, {
    country: "Turkey",
    locale: "tr_TR"
}];*/

const countries = [];

const getClinicCountries = () => {

    const dispatch = useDispatch();

    const { countries } = useSelector((state) => ({
        countries: state.countries.plato_countries
    }));

    useEffect(() => {
        dispatch(getPlatoCountries());
    }, []);

    return <>
        <option value="" hidden></option>
        {
            countries.map((value) => <option key={value.name}>{value.name}</option>)
        }
    </>;
}

export {countries, getClinicCountries};
