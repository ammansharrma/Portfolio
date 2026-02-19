import { memo } from 'react';

const MainLogo = ({ className, ...props }) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      xmlnsXlink="http://www.w3.org/1999/xlink" 
      width="41" 
      height="44" 
      viewBox="0 0 41 44"
      className={className}
      {...props}
    >
      <image 
        xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACkAAAAsCAYAAAD4rZFFAAAEdUlEQVR4AbSZj1nbMBDFXSagG8AGbFCYoHQCYALoBMAELRMUNoAJoBuwAWzQbgDvp9iKz36S7eRLPp0lS6e7p/unEPaaLT8fHx/HomfRPxGNnvezLUXn7RuDFJoD0bMkQcfq90U0et7vtf4mOmByG9oIZKu4A1fTD0CsCvAaX3VtI5CS+EsEAHWTDb4/k1wVhsUgZUVceVqR6ZZOte/ILcyZWwxSQs9Fw/auiZMv+tCL/ouGze0b8tj3RSBlDVznsvZG+F7Q0PZ3jAd0pv2TsQmP6FJ0I0JfswiklF6Khu1dwB4Gk7/1PrQmAK80X2wCBQ8Jyf5rMVIdjpeCdLF4I2GhCTQArTUDY++lB3AYu1ezQUoIMZXM35PN8C8PQ1hjOE1tJfHCvGR3FhwCTHyzQYrbxeK9rEbSaDk2zWPNFKdxpQkgJwAiY54lJQgLBuHN6jOMxdXs+vm0HubR924kuVULio+K8T7XkqO4kwASxllKS7nd59F6cCRwHJoZLgXrYi1eyBuv6mdn9zeYB+SABxYpwV3uIOcCyi1EnIc97QsA8wEnLSlhCOpO3spIXSlh0mLv4VxOKUNujy0PA0BmJ0GKCYHqQismTOBavTyuuvAkFsNE+zICyHwVpKxIvEDw9snVwP56HsvlZL9zeeZpBxYga1WQYnA3xKsUp4DW+tw2FRpFgCgogpQViUNXG12RRlaNkFVa/6lD5yRxTEWQYnZ1kbIzVRu1dd10WO5gd1iYiO3JQ9dAIhxBfZoTW5m/BVgrVTULZzkWpIRjRSfgNu+cGEgGh6wBRAKFvZTprCeyILXiatiLYodM1XK9zQSIEAC6b1asZRqBlAIs6GKoGtydRO2vWdAd0t1mnbjUj0BqFlerC21WwkwAJFQugtTVC3//YNHVm3k6kFhiyOpujcAzBVCh0v2JwX3e3wtAd2FkngBSiogP3J0Z2kH1htE+DlZKklsAtnLo3F2OXtYsBZDicLH4JCUulsTeNAsBssfFttMLb6IMUsqwoDtRsdhqz7WkzLWgWFPjSh25XLJcLqQNGaTenDISxhZwCd0EYCOvABCgUhmaM1Bi6IN0pcAB38TFSVnv4a7WossTSFmF4o27e3LScPTtRbw1C97JUvZgSdr64arFvmRblyeQ2pv/ONK4a1z+IWEkhNOWQDwIoPtq18nLvfhwuQsjD1KKsaCLh+AS8QHQZSbKAYg3GM8lV4rQMdqPJR36kDA7AAgQd2B+PMBorGcCpEOfXbEjgF2WZz0ZUdOMPAJIZ0nuWbKYA7gTN/ps4mJtC825fFRlABl2dS+7smAnv+1dlvOPAu7zlqVJPw64wvomjpIFH5WdI5eIf3GTHKrHpMuxpDN5SSEHcl+3Svxz5ke1WJtCSQQkdzMn0lq1AZAfkKhxVcaFi86SweV7MjlKTyS4BpTY2QVAshyQTveRMKWGJWGkLh5qBleyCeBsZAy4H+1hxLKTFi6OVgP60zCBTCM9BISrEFBfNT4UMQaoVnfaCLkOKAbCKBnkJwAAAP//W0vzCgAAAAZJREFUAwAF6YBH9LQ8CwAAAABJRU5ErkJggg==" 
        x="0" 
        y="0" 
        width="41" 
        height="44"
      />
    </svg>
  );
};

export default memo(MainLogo);
