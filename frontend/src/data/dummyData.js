export const currentUser = {
    id: 'user_1',
    name: 'Tauhir September',
    handle: '@tauhir',
    location: 'Cape Town, ZA',
    tags: ['Photographer', 'Cape Town, ZA'],
    bio: 'Chasing golden hour across the Cape peninsula. Film and digital.',
    joined: 'August 2024',
    stats: { posts: 47, albums: 3, friends: 128 },
    links: [
        { label: 'Website', url: '#' },
        { label: 'Instagram', url: '#' },
    ],
};

export const friends = [
    { id: 'user_2', name: 'Deon Steenkamp', handle: '@deon' },
    { id: 'user_3', name: 'Raahil Bhika', handle: '@bhika' },
    { id: 'user_4', name: 'Naledi Khumalo', handle: '@naledik' },
    { id: 'user_5', name: 'Kyle Adams', handle: '@kyleadams' },
];

export const suggestedFriends = [
    { id: 'user_6', name: 'Priya Naidoo', handle: '@priyan' },
    { id: 'user_7', name: 'Sipho Dlamini', handle: '@sphod' },
];

export const posts = [
    {
        id: 'post_1',
        author: { id: 'user_1', name: 'Tauhir September' },
        postedAt: '2 hrs ago',
        description:
            'Golden light over Table Mountain this morning. Worth the 5am wake up call.',
        hashtags: ['#photography', '#tablemountain', '#capetown', '#goldenhour'],
        likes: 84,
        commentCount: 4,
        views: 312,
        albums: [
            { id: 'album_1', name: 'Summer 2025' },
            { id: 'album_2', name: 'Street Photography' },
        ],
    },
    {
        id: 'post_2',
        author: { id: 'user_2', name: 'Deon Steenkamp' },
        postedAt: '5 hrs ago',
        description: 'Long exposure of the harbour at blue hour.',
        hashtags: ['#longexposure', '#harbour', '#bluehour'],
        likes: 41,
        commentCount: 2,
        views: 128,
        albums: [{ id: 'album_3', name: 'Night Shots' }],
    },
    {
        id: 'post_3',
        author: { id: 'user_3', name: 'Raahil Bhika' },
        postedAt: '1 day ago',
        description: 'Portrait series shot on 35mm film.',
        hashtags: ['#film', '#portrait', '#35mm'],
        likes: 67,
        commentCount: 9,
        views: 245,
        albums: [{ id: 'album_4', name: 'Film Rolls' }],
    },
];

export const comments = [
    {
        id: 'comment_1',
        author: 'Deon Steenkamp',
        postedAt: '1 hr ago',
        text: 'This light is unreal, what settings did you use?',
    },
    {
        id: 'comment_2',
        author: 'Raahil Bhika',
        postedAt: '2 hrs ago',
        text: 'Table Mountain never disappoints. Great composition.',
    },
    {
        id: 'comment_3',
        author: 'Naledi Khumalo',
        postedAt: '3 hrs ago',
        text: 'Adding this spot to my list, thank you for sharing!',
    },
    {
        id: 'comment_4',
        author: 'Kyle Adams',
        postedAt: '4 hrs ago',
        text: 'The colour grading here is beautiful.',
    },
];

export const reportReasons = [
    'Spam',
    'Inappropriate content',
    'Copyright violation',
    'Harassment',
    'Other',
];