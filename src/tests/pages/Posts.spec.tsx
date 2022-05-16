import { render, screen } from '@testing-library/react';
import Posts, { getStaticProps } from '../../pages/posts';
import { mocked } from 'jest-mock';
import { getPrismicClient } from '../../services/prismic';

const posts = [{
  slug: 'my-new-post', 
  title: 'My new post',
  excerpt: 'Post excerpt',
  updatedAt: '01 de maio de 2022',
}];

jest.mock('../../services/prismic')

describe('Posts page', () => {

  it('renders correctly', () => {

    render(<Posts posts={posts}/>)

    expect(screen.getByText("My new post")).toBeInTheDocument()

  });

 it('loads initial data', async() => {

    const getPrismicClientMocked = mocked(getPrismicClient);

    getPrismicClientMocked.mockReturnValueOnce({
      query: jest.fn().mockResolvedValueOnce({
        results:[
          { 
            uid: 'my-new-post',
            data:{
              title:[
                { type: 'heading', text: 'My new post'}
              ],
              content:[
                { type: 'heading3', text: 'Post excerpt'}
              ],
            },
            last_publication_date:'05-01-2022',
          }
        ]
      })
    } as any )

    const response = await getStaticProps({})

    expect(response).toEqual(
      expect.objectContaining({
        props:{
          posts: [{
            slug: 'my-new-post',
            title: 'My new post', 
            excerpt: 'Post excerpt',
            updatedAt: '01 de maio de 2022'
          }]
        }
      })
    )

    console.log(response)

  });

})