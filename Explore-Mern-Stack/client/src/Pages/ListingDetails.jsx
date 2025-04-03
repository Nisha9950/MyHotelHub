import axios from 'axios';
    import { useEffect, useState } from 'react';
    import { useParams } from 'react-router-dom';

    const ListingDetails = () => {
        const { id } = useParams();  // URL se listing ID le rahe hain
        const [listing, setListing] = useState(null);
        const [error, setError] = useState(false);

        useEffect(() => {
            const fetchListing = async () => {
                try {
                    const res = await axios.get(`http://localhost:3000/api/listing/${id}`);
                    setListing(res.data.listing);
                } catch (error) {
                    console.error("Error fetching listing:", error.message);
                    setError(true);
                }
            };
            fetchListing();
        }, [id]);

        if (error) return <p>Error fetching listing details.</p>;
        if (!listing) return <p>Loading...</p>;

        return (
            <div>
                <h2>{listing.name}</h2>
                <p>{listing.description}</p>
                <p>Address: {listing.address}</p>
            </div>
        );
    };

    export default ListingDetails;