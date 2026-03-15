declare module 'airportsjs' {
  const index: {
    lookupByIataCode: (iata: string) => {
      name: string;
      city: string;
      country: string;
      iata: string;
    };
  };
  export default index;
}