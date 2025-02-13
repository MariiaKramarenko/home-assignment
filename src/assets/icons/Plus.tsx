interface Props {
    color: string;
}
export const Plus = (props:Props) => (
    <svg 
        width="16" 
        height="16" 
        viewBox="0 0 24 24" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
    >

    <path 
        d="M11 11V5H13V11H19V13H13V19H11V13H5V11H11Z"
        fill={props.color}
     />
    </svg>
  );