const MoviePrice = ({ price }) => {
  return (
    <span className="modal-price">
      {price.isOnSale ? (
        <>
          <span className="original-price">${price.original}</span>
          <span className="sale-price">${price.sale}</span>
        </>
      ) : (
        `$${price.original}`
      )}
    </span>
  );
};

export default MoviePrice;
