import React, { useEffect, useState } from "react";
import "./Timing.scss";

interface IProps {
  title: string;
  defaultValue: number;
  action: () => void;
}

const Timing = ({ title, defaultValue, action }: IProps) => {
  const [count, setCount] = useState(defaultValue);

  const handleAction = () => {
    action();
    setCount(defaultValue);
  };

  useEffect(() => {
    if (count !== 0) {
      setTimeout(() => {
        setCount(count - 1);
      }, 1000);
    }
  }, [count]);

  return (
    <div className="Timing">
      <p className="Timing__title">{title}</p>
      {count ? (
        <p className="Timing__count">{count} giây</p>
      ) : (
        <p className="Timing__action" onClick={handleAction}>
          Gửi mã
        </p>
      )}
    </div>
  );
};

export default Timing;
