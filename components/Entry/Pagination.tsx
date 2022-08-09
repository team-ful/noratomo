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
import {useRouter} from 'next/router';
import React from 'react';

interface Props {
  all: number;
  current: number;
}

const PAGE_NUMBER = 20;

const Paginate: React.FC<Props> = ({all, current}) => {
  const router = useRouter();
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
    setCurrentPage(current);
  }, [current]);

  const newPage = (page: number) => {
    const query = router.query;
    // pageがある場合は上書き
    query['page'] = String(page);

    const q = [];
    for (const key in query) {
      q.push(`${key}=${query[key]}`);
    }

    router.push(`/entry/create/search?${q.join('&')}`);
  };

  return (
    <Box>
      <Pagination
        pagesCount={pagesCount}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      >
        <PaginationContainer w="full" align="center" justify="space-between">
          <PaginationPrevious
            onClick={() => newPage(currentPage - 1)}
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
                onClick={() => newPage(page)}
              />
            ))}
          </PaginationPageGroup>
          <PaginationNext onClick={() => newPage(currentPage + 1)} ml="1rem">
            &gt;
          </PaginationNext>
        </PaginationContainer>
      </Pagination>
    </Box>
  );
};

export default Paginate;
