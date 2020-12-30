import { getNodeText } from '@testing-library/react';
import React from 'react';

const Pagination = (props) => {

	return (
		<div>
            {props.currentPageNo > 0 ?(<button activeclassname="active" click={()=>props.getPreviosPage()}> <span> Previous </span> </button>): ''}

            {props.totalData && props.totalData > 100 ?(<button activeclassname="active" click={()=>props.getNextPage()}> <span> Previous </span> </button>): ''}
        </div>
	);
};

export default Pagination;