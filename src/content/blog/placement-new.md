---
title: "Placement new"
description: ''
pubDate: '2007-08-20'
heroImage: '../../assets/fallback-blossom-blue.jpg'
categories:
  - "c"
  - "programming"
---

**REPLACEMENT NEW CAME** to mind, when working on a C++ project of mine. In this project some large objects of short lifetime led to a concerns about memory fragmentation on the targeted embedded platform that have only sparse memory ressources. The life cycle of the objects was to create an object, then fill the large data member structures, store data for a while until time for transmitting the data and terminate the object. The object data where always different so they could not be reused, and the lifetime of each object was inditerminable. However it was certain that only a known maximum amount of objects would exist at the same time.

This senario made me think of a rarely used memory allocation functionality called `placement new` that would handle the above concerns perfectly. With this variant of `new` you allocate a memory pool of fixed memory address and size, from which allocations can be made from. This way `placement new` allows reuse of the same memory again and again and thus containing any memory fragmentation within the disposable memory pool.

Below is a simple example of how to use the placement new functionality.

```
#include 
#include 
#include 
#include 
using namespace std;
 
class C
{
  public:
            C() : data(0x11) { ; }
            ~C() { data = 0x22; }
 
            char data;
};
 
int main(int argc, char *argv[])
{
  const int PoolItems = 6;
  const int PoolSize  = PoolItems * sizeof(C);
 
  // Allocate a memory pool
  char *pool = new char[PoolSize];
  memset(pool, 0x00, PoolSize);
 
  // Create some pointers to access pooled objects
  C *pC[PoolItems] = { 0 };
 
  // Allotate objects at "arbitary" addresses in the pool
  pC[1] = new (pool + sizeof(C)*1) C;
  pC[4] = new (pool + sizeof(C)*4) C;
 
  // Display constructed data
  for (int i = 0; i < PoolSize; i++)
    cout << setfill('0') << setw(2) << std::hex << (int)pool[i] << " ";
  cout << endl;
 
  // Explicit destruction of objects in pool
  for (int i = 0; i < PoolItems; i++)
  {
    if (pC[i] != NULL)
    {
      pC[i]->~C();  // Explicit destructor call
      pC[i] = NULL;
    }
  }
 
  // Display destructed data
  for (int i = 0; i < PoolSize; i++)
    cout << setfill('0') << setw(2) << std::hex << (int)pool[i] << " ";
  cout << endl;
 
  // Release memory in pool
  delete [] pool;
  pool = NULL;
 
  return EXIT_SUCCESS;
}

```

  

Explanation: First a memory pool is created that fits a fixed amount of the designated class objects. Two object are then created within pool slots 1 and 4. The simple byte sized class `C` has a contructor initialization of the member data.

The first printing of the pool will display the following contents:

```
00 11 00 00 11 00
```

This indicates that two slots are allocated with objects of the class `C`.

Destructing the objects are done by calling the destructor explicitly, NOT by normal delete action (as the memory pool original was created as a char array, the memory it occupies is tagged as a char array that must be deleted the approriate array delete operation). After destruction, the pool contents is displayed again, and it is seen that the same memory has been rewritten by the destructor assigning:

```
00 22 00 00 22 00
```

Finally the memory pool is deleted and the memory is released.
