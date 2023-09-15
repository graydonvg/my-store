import Image from 'next/image';
import products from '../lib/products';

type ProductsProps = {};

export default function Products() {
  return (
    <>
      {products.map((category) => {
        return (
          <div key={category.category}>
            <h2>{category.category}</h2>
            {category.items.map((item) => {
              return (
                <div key={item.id}>
                  <Image
                    height={50}
                    width={50}
                    src={item.thumbnail}
                    alt={item.description}
                  />
                  <h3>{item.title}</h3>
                </div>
              );
            })}
          </div>
        );
      })}
    </>
  );
}
