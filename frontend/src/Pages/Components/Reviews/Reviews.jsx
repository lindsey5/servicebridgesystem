import { useEffect, useRef, useState } from 'react';
import './Reviews.css';
import Review from './Review';
import useFetch from '../../../hooks/useFetch';

const Reviews = ({id, rating}) => {
    const [reviews, setReviews] = useState();
    const { data: fetchedReviews } = useFetch(`/api/transactions/reviewed/${id}`);
    const starsRef = useRef([]);
    const [filter, setFilter] = useState('All');
    const [ratingPercentages, setRatingPercentages] = useState();
    const filterButtons = useRef([]);

    useEffect(() => {
        for(let i = 0; i < rating; i++){
            starsRef.current[i].style.color = 'rgb(3, 117, 247)'
        }

    },[rating])

    useEffect(() => {
        setReviews(fetchedReviews);
    }, [fetchedReviews]);

    useEffect(() => {
        if(fetchedReviews){
            const totalReviews = fetchedReviews.length;
            const ratingCounts = [0, 0, 0, 0, 0];

            fetchedReviews.forEach(review => {
                const reviewRating = review.rating;
                if (reviewRating >= 1 && reviewRating <= 5) {
                    ratingCounts[reviewRating - 1] += 1;
                }
            });
            setRatingPercentages(ratingCounts.map(count => totalReviews ? Math.round((count / totalReviews) * 100)  : 0));
        }
        //console.log(reviews)
    },[fetchedReviews]);

    const setSelectedFilterBtn = (target) => {
        for(const button of filterButtons.current){
            if(button == target){
                button.style.border = '1px solid  rgb(3, 117, 247)';
                button.style.color = 'rgb(3, 117, 247)';
                setFilter(button.textContent);
            }else{
                button.style.border = '1px solid  grey';
                button.style.color = 'black';
            }
        }
    }

    useEffect(() => {
        const filterReviews = async () => {
            if(filter !== 'All'){
                setReviews(fetchedReviews.filter(review => review.rating == filter));
            }else{
                setReviews(fetchedReviews);
            }
        }
        filterReviews();
    }, [filter]);


    const reviewPercentages = () => {
        const reviewElements = [];
        for (let i = ratingPercentages?.length - 1; i >= 0; i--) {
            reviewElements.push(
                <div className="percentage-container" key={i}>
                    <span style={{marginRight: '5px'}}>{i + 1}</span>
                    <div className="percentage">
                        <div style={{width: `${ratingPercentages[i]}%`}}></div>
                    </div>
                    <span style={{marginLeft: '10px'}}>{ratingPercentages[i]}%</span>
                </div>
            );
        }
        return reviewElements;
    };
    

    return (
        <main className="Provider-reviews">
            <div className="top-section">
            <div>
                <div className="reviews-detail">
                    <h4>Total Reviews</h4>
                    <div>
                    {fetchedReviews && <h1>{fetchedReviews.length}</h1>}
                    </div>
                </div>
                <div className="reviews-detail">
                    <h4>Average Rating</h4>
                    <div>
                        {rating && <h1>{rating}</h1>}
                        <span className="star" ref={el => starsRef.current[0] = el}>★</span>
                        <span className="star" ref={el => starsRef.current[1] = el}>★</span>
                        <span className="star" ref={el => starsRef.current[2] = el}>★</span>
                        <span className="star" ref={el => starsRef.current[3] = el}>★</span>
                        <span className="star" ref={el => starsRef.current[4] = el}>★</span>
                    </div>
                </div>
                <div className="reviews-detail">
                    {reviewPercentages()}
                </div>
            </div>
            </div>
            <div className='review-filter'>
                <button ref={el => filterButtons.current[0] = el} onClick={(e) => setSelectedFilterBtn(e.target)}>All</button>
                <button ref={el => filterButtons.current[1] = el} onClick={(e) => setSelectedFilterBtn(e.target)}>5</button>
                <button ref={el => filterButtons.current[2] = el} onClick={(e) => setSelectedFilterBtn(e.target)}>4</button>
                <button ref={el => filterButtons.current[3] = el} onClick={(e) => setSelectedFilterBtn(e.target)}>3</button>
                <button ref={el => filterButtons.current[4] = el} onClick={(e) => setSelectedFilterBtn(e.target)}>2</button>
                <button ref={el => filterButtons.current[5] = el} onClick={(e) => setSelectedFilterBtn(e.target)}>1</button>
            </div>
            <div className='reviews'>
                {reviews && reviews.map(review => <Review key={review.transaction_id} review={review}/>)}
            </div>
        </main>
    )

}

export default Reviews