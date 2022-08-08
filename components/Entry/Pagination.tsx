import {
  Pagination,
  usePagination,
  PaginationNext,
  PaginationPage,
  PaginationPrevious,
  PaginationContainer,
  PaginationPageGroup,
  PaginationSeparator,
} from '@ajna/pagination';
import {Box} from '@chakra-ui/react';
import React from 'react';

interface Props {
  all: number;
  init: boolean;
  newPage: (page: number) => void;
}

const PAGE_NUMBER = 20;

const Paginate: React.FC<Props> = ({all, init, newPage}) => {
  const {currentPage, setCurrentPage, pagesCount, pages} = usePagination({
    pagesCount: Math.ceil(all / PAGE_NUMBER),
    initialState: {
      currentPage: 1,
    },
    limits: {
      outer: 2,
      inner: 2,
    },
  });

  React.useEffect(() => {
    setCurrentPage(1);
  }, [init]);

  return (
    <Box>
      <Pagination
        pagesCount={pagesCount}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      >
        <PaginationContainer w="full" align="center" justify="space-between">
          <PaginationPrevious
            onClick={() => newPage(currentPage - 2)}
            mr="1rem"
          >
            &lt;
          </PaginationPrevious>
          <PaginationPageGroup
            separator={<PaginationSeparator variant="ghost" jumpSize={30} />}
          >
            {pages.map((page: number) => (
              <PaginationPage
                key={`pagination_page_${page}`}
                page={page}
                variant={page === currentPage ? 'solid' : 'ghost'}
                width="2rem"
                onClick={() => newPage(page - 1)}
              />
            ))}
          </PaginationPageGroup>
          <PaginationNext onClick={() => newPage(currentPage)} ml="1rem">
            &gt;
          </PaginationNext>
        </PaginationContainer>
      </Pagination>
    </Box>
  );
};

export default Paginate;
